import { FunctionComponent, useEffect, useState } from "react";
import { MobileViewProps, NodeDef, NodeHeaderProps } from "../engine/node";
import {
  useCommittedData,
  useHandleData,
  useInputHandleData,
} from "../engine/store";
import { categories } from "./category";
import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { useDeepDebounced } from "../hooks/useDeepDebounced";
import { useDebounce } from "use-debounce";

type Post = {
  id: number;
  file: {
    url: string;
  };
  preview: {
    url: string;
  };
  sources: string[];
};

const PostSourcesDisplay: FunctionComponent<{ post: Post }> = ({ post }) => {
  return (
    <div className="text-xs">
      <h3>Sources</h3>
      <ul>
        {post.sources.map((source: any, index: any) => (
          <li key={index}>
            <a
              href={source}
              className="block overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {source}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

interface MediaFetcherState {
  currentIndex: number;
  bufferedPosts: Post[];
  tags: string;

  setCurrentIndex: (i: number) => void;
  refresh: (reset?: boolean) => void;
  getLastBufferedPostId: () => number | null;
  setTags: (tags: string) => void;
}

const PAGE_SIZE = 10;
const useMediaFetcher = create(
  immer<MediaFetcherState>((set, get) => ({
    currentIndex: 0,
    bufferedPosts: [],
    tags: "fluffy",

    setTags: (tags: string) => {
      if (tags !== get().tags) {
        set((state) => {
          state.tags = tags;
        });
        get().refresh(true);
      }
    },

    setCurrentIndex: (i: number) => {
      if (i !== get().currentIndex) {
        set((state) => {
          state.currentIndex = i;
          state.bufferedPosts.shift();
        });
        get().refresh();
      }
    },

    refresh: (reset) => {
      if (reset || get().bufferedPosts.length < PAGE_SIZE) {
        const tags = get().tags;
        const lastPostId = get().getLastBufferedPostId();
        const pageParam =
          lastPostId === null || reset ? "" : `&page=b${lastPostId}`;
        fetch(
          `https://e621.net/posts.json?tags=${tags}&limit=${PAGE_SIZE}${pageParam}`
        )
          .then((response) => response.json())
          .then((json) => {
            const posts = json.posts.filter(
              (it: any) => it?.file?.url !== null
            );
            if (
              get().getLastBufferedPostId() === lastPostId &&
              get().tags === tags
            ) {
              if (reset) {
                set((state) => {
                  state.bufferedPosts = posts;
                });
                get().refresh(false);
              } else {
                set((state) => {
                  state.bufferedPosts.push(...posts);
                });
                get().refresh(false);
              }
            }
          });
      }
    },

    getLastBufferedPostId: () => {
      const buffered = get().bufferedPosts;
      if (buffered.length == 0) {
        return null;
      } else {
        return buffered[buffered.length - 1].id;
      }
    },
  }))
);

(() => {
  useMediaFetcher.getState().setCurrentIndex(0);
})();

const DisplayHeader: FunctionComponent<NodeHeaderProps> = ({ id, data }) => {
  const committed = useCommittedData<number>(id, "index");
  const [rawTags] = useInputHandleData<string>(id, "tags");
  const [tags] = useDebounce(rawTags, 1000);

  const [setIndex, setTags, post, nextPost] = useMediaFetcher((s) => [
    s.setCurrentIndex,
    s.setTags,
    s.bufferedPosts[0],
    s.bufferedPosts[1],
  ]);

  useEffect(() => {
    setIndex(committed);
  }, [committed, setIndex]);

  useEffect(() => {
    setTags(tags);
  }, [tags, setTags]);

  if (post == null || nextPost == null) {
    return <h1>???</h1>;
  } else {
    return (
      <div>
        <img src={post.preview?.url} alt="from e621" height={100}></img>
        <img
          src={nextPost.preview?.url}
          alt="from e621"
          className="hidden"
        ></img>
        <p>{post.id}</p>
        <p>{tags}</p>
        <PostSourcesDisplay post={post}></PostSourcesDisplay>
      </div>
    );
  }
};

const DisplayMobileView: FunctionComponent<MobileViewProps> = ({ id }) => {
  const committed = useCommittedData<number>(id, "index");

  const [rawTags] = useInputHandleData<string>(id, "tags");
  const [tags] = useDebounce(rawTags, 1000);
  const [setIndex, setTags, post, nextPost] = useMediaFetcher((s) => [
    s.setCurrentIndex,
    s.setTags,
    s.bufferedPosts[0],
    s.bufferedPosts[1],
  ]);

  useEffect(() => {
    setIndex(committed);
  }, [committed, setIndex]);

  useEffect(() => {
    setTags(tags);
  }, [tags, setTags]);

  if (post == null || nextPost == null) {
    return <h1>???</h1>;
  } else {
    return (
      <div>
        <img src={post.file?.url} alt="from e621"></img>
        <img src={nextPost.file?.url} alt="from e621" className="hidden"></img>
        <p>{post.id}</p>
        <PostSourcesDisplay post={post}></PostSourcesDisplay>
      </div>
    );
  }
};

const HISTORY_LENGTH = 3 * 60;

export const mediaFurryNodeDef: NodeDef = {
  label: "E621",
  category: categories["media"],
  type: "e621",
  // component: DisplayNode,
  header: DisplayHeader,
  outputs: [],
  mobileView: DisplayMobileView,
  inputs: [
    {
      id: "next",
      label: "Next",
      type: "impulse",
      default: 0.0,
      terminal: true,
    },
    {
      id: "tags",
      label: "Tags",
      type: "string",
      default: "fluffy",
      terminal: true,
    },
  ],
  executor: ([v], { commit, committed }) => {
    let current = committed["index"] ?? 0;
    if (v) {
      commit("index", current + 1);
    }

    return [];
  },
};
