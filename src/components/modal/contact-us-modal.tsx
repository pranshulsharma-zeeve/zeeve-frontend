"use client";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@zeeve-platform/ui";
import { IconXMarkSquare } from "@zeeve-platform/icons/essential/outline";
import { IconPhone } from "@zeeve-platform/icons/phone/outline";
import { IconDocument1Text } from "@zeeve-platform/icons/document/outline";
import QueryForm from "./components/queryForm";
import { useModalStore } from "@/store/modal";

const ContactUsModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();

  const isModalOpen = isOpen && type === "contactUs";

  return (
    <Modal isOpen={isModalOpen} handleClose={onClose} shouldBackdropDismiss={false}>
      <ModalOverlay />
      <ModalContent className="h-[95%] w-full max-w-4xl rounded-2xl bg-[#F5F5F5] p-6">
        <ModalTitle className="flex w-full items-center justify-between text-[#080E12]">
          <span className="text-2xl font-semibold tracking-[0.1px]">Book a Demo</span>
          <IconXMarkSquare className="size-6 cursor-pointer" onClick={onClose} />
        </ModalTitle>
        <ModalBody className="mt-4 h-full gap-0 p-0">
          <Tabs orientation="horizontal" className="size-full rounded-none border-none bg-transparent p-0">
            <TabList className="mb-6 gap-x-10 border-b bg-transparent">
              <Tab className="px-0">
                <span className="flex items-center gap-x-2 font-semibold tracking-[0.1px] lg:text-base">
                  <IconPhone className="size-5" />
                  Schedule a call
                </span>
              </Tab>
              <Tab className="px-0">
                <span className="flex items-center gap-x-2 font-semibold tracking-[0.1px] lg:text-base">
                  <IconDocument1Text className="size-5" />
                  Send your Query
                </span>
              </Tab>
            </TabList>
            <TabPanels className="h-full">
              <TabPanel className="h-full">
                <iframe
                  src={
                    "https://calendly.com/d/37f-nwx-d3p/zeeve-partner-success-discussion?hide_event_type_details=1&hide_gdpr_banner=1"
                  }
                  width="100%"
                  height="100%"
                  className="rounded-md p-0"
                />
              </TabPanel>
              <TabPanel className="h-full">
                <QueryForm protocolName={data?.contactUs?.protocolName ?? "besu"} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContactUsModal;
