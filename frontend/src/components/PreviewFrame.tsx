import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";

interface PreviewFrameProps {
  webContainer: WebContainer | undefined;
}

export function PreviewFrame({ webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");

  async function main() {
    const installProcess = await webContainer?.spawn("npm", ["install"]);
    installProcess?.output.pipeTo(
      new WritableStream({
        write(data) {
          console.log(data);
        },
      })
    );

    console.log("webContainer process completed...");
    await webContainer?.spawn("npm", ["run", "dev"]);
    console.log("webContainer npm run dev completed...");

    // Wait for `server-ready` event
    webContainer?.on("server-ready", (port, url) => {
      console.log("Url is :", url, port);
      console.log(url);
      console.log(port);
      setUrl(url);
    });
  }

  useEffect(() => {
    main();
  }, []);

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && (
        <div className="text-center">
          <p className="mb-2">Loading...</p>
        </div>
      )}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { WebContainer } from "@webcontainer/api";

// interface PreviewFrameProps {
//   webContainer: WebContainer | undefined;
// }
// const PreviewFrame = ({ webContainer }: PreviewFrameProps) => {
//   const [url, setUrl] = useState("");
//   async function main() {
//     const installProcess = await webContainer?.spawn("npm", ["install"]);

//     installProcess?.output.pipeTo(
//       new WritableStream({
//         write(data) {
//           console.log(data);
//         },
//       })
//     );

//     await webContainer?.spawn("npm", ["run", "dev"]);

//     // wait for 'server-ready' event
//     webContainer?.on("server-ready", (port, url) => {
//       console.log(url);
//       setUrl(url);
//       console.log(port);
//     });
//   }
//   useEffect(() => {
//     main();
//   }, []);

//   // console.log(files);
//   return (
//     <div className="h-full flex item-center justify-center text-gray-400">
//       {!url && (
//         <div className="text-center">
//           <p className="mb-2">loading...</p>
//         </div>
//       )}
//       {url && <iframe width={"100%"} height={"100%"} src={url}></iframe>}
//     </div>
//   );
// };

// export default PreviewFrame;
