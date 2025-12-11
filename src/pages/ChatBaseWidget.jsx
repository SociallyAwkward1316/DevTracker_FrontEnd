import { useEffect } from "react";

export default function ChatbaseWidget() {
  useEffect(() => {
    // prevent loading more than once
    if (window.chatbase) return;

    // safe bootstrap function (no arrow + arguments issues)
    window.chatbase = function () {
      window.chatbase.q = window.chatbase.q || [];
      window.chatbase.q.push(arguments);
    };

    const script = document.createElement("script");
    script.src = "https://www.chatbase.co/embed.min.js";
    script.id = "vnoDUitLqOs_atMPDjF14"; // your bot ID
    script.domain = "www.chatbase.co";
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return null;
}
