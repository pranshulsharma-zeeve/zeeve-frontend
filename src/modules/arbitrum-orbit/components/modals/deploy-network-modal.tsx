"use client";
import {
  ModalText,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalTitle,
  StatusIcon,
  Link,
  Card,
} from "@zeeve-platform/ui";
import { useRouter } from "next/navigation";
import { IconCalendarCircleCheck } from "@zeeve-platform/icons/time/outline";
import { useModalStore } from "@orbit/store/modal";
import ROUTES from "@orbit/routes";

const DeployNetworkModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const router = useRouter();

  const isModalOpen = isOpen && type === "deployNetwork";

  const navigateToList = () => {
    router.replace(`${ROUTES.ARBITRUM_ORBIT.PAGE.LIST}`);
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} handleClose={navigateToList} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className=" w-full max-w-xl">
        <ModalBody>
          <StatusIcon status="success" />
          <div className="flex flex-col gap-y-1">
            <ModalTitle>Thank You</ModalTitle>
            <ModalText>Thanks for submitting your proposal request. Our support team will reach you soon.</ModalText>
            <ModalText>
              <Link href="https://calendly.com/d/37f-nwx-d3p/zeeve-partner-success-discussion" target={"_blank"}>
                <Card className="col-span-12 gap-3 bg-brand-light p-3 text-brand-dark hover:border-brand-teal lg:gap-3 lg:p-3">
                  <div className="flex flex-row  justify-between">
                    <div className="flex flex-row items-center gap-3">
                      <div className="rounded-lg p-3 bg-brand-gradient-10">
                        <IconCalendarCircleCheck width={32} height={32} className=" text-brand-cyan" />
                      </div>
                      <div>
                        <div className="text-base font-semibold tracking-tight">Schedule a Call</div>
                        <p className="text-xs text-brand-gray">
                          Meanwhile, you can also schedule a call with our Rollup Expert team for your requirements.
                        </p>
                      </div>
                    </div>{" "}
                  </div>
                </Card>
              </Link>
            </ModalText>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-brand-outline">
          <Button onClick={navigateToList}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeployNetworkModal;
