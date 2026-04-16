"use client";
import { IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconTrash } from "@zeeve-platform/icons/essential/outline";
import { useNodeStore } from "@/store/node";
// import { useModalStore } from "@/store/modal";

const NodeActions = () => {
  // const params = useParams();
  // const { openModal } = useModalStore();
  // const networkId = params.id as string;
  // const rpcNodeId = params.rpcNodeId as string;
  // const { openModal } = useModalStore();

  const nodeInfo = useNodeStore((state) => state.nodeInfo);

  return (
    <Tooltip text="Delete Node" placement={"top-start"}>
      <IconButton
        colorScheme="red"
        variant={"outline"}
        isLoading={nodeInfo.isLoading}
        isDisabled
        // isDisabled={!(nodeInfo.data?.status === "ready" || nodeInfo.data?.status === "failed")}
        // onClick={() => {
        //     if (nodeInfo.data?.status === "ready" || nodeInfo.data?.status === "failed") {
        //         openModal("deleteNode", {
        //             deleteNode: {
        //                 type: "rpc",
        //                 networkId,
        //                 nodeId: rpcNodeId,
        //                 nodeName: nodeInfo.data?.name || "NA",
        //             },
        //         });
        //     }
        // }}
      >
        {<IconTrash className="text-xl" />}
      </IconButton>
    </Tooltip>
  );
};

export default NodeActions;
