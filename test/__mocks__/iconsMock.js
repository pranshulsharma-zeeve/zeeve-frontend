const React = require("react");

module.exports = new Proxy(
  {},
  {
    get: function getter() {
      return (props) => React.createElement("span", { "data-icon": "mock", ...props });
    },
  },
);
