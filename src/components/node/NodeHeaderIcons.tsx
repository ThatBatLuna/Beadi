import { FunctionComponent } from "react";
import { useDisplayStore, useMergeNodeData } from "../../engine/store";
import { MdMobileFriendly, MdMobileOff } from "react-icons/md";

type MobileVisibleSwitchProps = {
  nodeId: string;
  visible: boolean | undefined;
};
export const MobileVisibleSwitch: FunctionComponent<
  MobileVisibleSwitchProps
> = ({ nodeId, visible }) => {
  const mergeSettings = useMergeNodeData(nodeId);

  if (visible === false) {
    return (
      <MdMobileOff
        className="m-1 cursor-pointer"
        title="Hidden in Mobile Interface"
        onClick={() => mergeSettings({ mobileVisible: true })}
      ></MdMobileOff>
    );
  } else {
    return (
      <MdMobileFriendly
        className="m-1 cursor-pointer"
        title="Visible in Mobile Interface"
        onClick={() => mergeSettings({ mobileVisible: false })}
      ></MdMobileFriendly>
    );
  }
};
