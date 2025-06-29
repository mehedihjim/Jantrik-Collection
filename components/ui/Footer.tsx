import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-center select-none">
      &copy; {new Date().getFullYear()}{" "}
      {`Imraan's Collection. All rights reserved.`} Build by
      <a
        href="https://beacons.ai/mhjim"
        className="text-green-600 animate-pulse"
      >
        {" "}
        MHJim
      </a>
    </footer>
  );
};

export default Footer;
