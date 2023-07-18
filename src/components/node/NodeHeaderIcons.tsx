import { FunctionComponent } from "react";
import { useDisplayStore, useMergeNodeData } from "../../engine/store";
import { MdMobileFriendly, MdMobileOff } from "react-icons/md";
import { BsWifi, BsWifiOff } from "react-icons/bs";

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

type PublishedSwitchProps = {
  nodeId: string;
  published: boolean | undefined;
};
export const PublishedSwitch: FunctionComponent<PublishedSwitchProps> = ({
  nodeId,
  published,
}) => {
  const mergeSettings = useMergeNodeData(nodeId);

  if (published !== true) {
    return (
      <BsWifiOff
        className="m-1 cursor-pointer"
        title="Published for Remote Controlling"
        onClick={() => mergeSettings({ published: true })}
      ></BsWifiOff>
    );
  } else {
    return (
      <BsWifi
        className="m-1 cursor-pointer"
        title="Published for Remote Controlling"
        onClick={() => mergeSettings({ published: false })}
      ></BsWifi>
    );
  }
};
