"use client";
import React, { useEffect } from "react";
import { Config } from "@/config";
import { useConfigStore } from "@/store/config";

interface ConfigProviderProps extends React.PropsWithChildren {
  /** config.json file's contents */
  config: Config;
}

/**
 * ConfigProvider sets application's config.json into a global state.
 */
const ConfigProvider = (props: ConfigProviderProps) => {
  const { config, children } = props;

  // set config state
  const setConfig = useConfigStore((state) => state.setConfig);
  const configState = useConfigStore((state) => state.config);

  useEffect(() => {
    if (configState !== config) {
      setConfig(config);
    }
  }, [config, configState, setConfig]);

  return <>{children}</>;
};

export default ConfigProvider;
