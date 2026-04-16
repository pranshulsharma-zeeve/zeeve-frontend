"use client";
import { IconButton, Tooltip } from "@zeeve-platform/ui";
import { IconTrash } from "@zeeve-platform/icons/essential/outline";
import { useParams } from "next/navigation";
import { useModalStore } from "@/store/modal";
import { useUserStore } from "@/store/user";
import { useZksyncStore } from "@/store/zksync";

const NetworkAction = () => {
  const params = useParams();
  const { id } = params;
  const networkId = id as string;
  const superNetInfo = useZksyncStore((state) => state.zksyncInfo);

  const user = useUserStore((state) => state.user);
  const { openModal } = useModalStore();

  return (
    <Tooltip text="Delete Network" placement={"top-start"}>
      <IconButton
        colorScheme="red"
        variant={"outline"}
        isLoading={superNetInfo.isLoading}
        isDisabled={
          (superNetInfo.data?.status !== "ready" && superNetInfo.data?.status !== "failed") ||
          superNetInfo.data?.ownedBy !== user?.usercred
        }
        onClick={() => {
          if (superNetInfo.data?.status === "ready" || superNetInfo.data?.status === "failed") {
            openModal("deleteNetwork", {
              deleteNetwork: { networkId, networkName: superNetInfo.data?.name || "" },
            });
          }
        }}
      >
        {<IconTrash className="text-xl" />}
      </IconButton>
    </Tooltip>
  );
};

export default NetworkAction;
