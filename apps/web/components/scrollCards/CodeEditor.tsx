import React from "react";
import { FaPython } from "react-icons/fa6";
import { IoIosGitBranch } from "react-icons/io";
import { LuFiles } from "react-icons/lu";
import { RxCross1 } from "react-icons/rx";
import { VscSearch, VscDebugAlt, VscExtensions } from "react-icons/vsc";

const CodeEditor = () => {
  return (
    <>
      <div className="w-full  px-7.5 sm:px-2 py-2 flex sm:justify-end justify-start items-center ">
        <div className="flex justify-between  items-center gap-2 border border-border-theme rounded-xl w-fit p-2 text-text-theme">
          <FaPython className="text-blue-400" />
          hello.py <RxCross1 />
        </div>
      </div>
      <div className="flex gap-1 sm:gap-3 pl-1 sm:pl-2 h-full ">
        <div className="gap-5 px-1 sm:px-2 py-1 flex justify-items-start flex-col text-sm sm:text-xl text-text-theme mb-5">
          <LuFiles />
          <VscSearch />
          <IoIosGitBranch />
          <VscDebugAlt />
          <VscExtensions />
        </div>
        <div className="flex flex-col w-full h-full ">
          <div className="p-2 sm:p-4 gap-4 w-full flex border rounded-tl-xl border-border-theme h-full border-b-0 border-r-0">
            <div className="text-[8px] sm:text-xs text-text-theme flex flex-col gap-1.5 justify-center items-center">
              <p>1</p>
              <p>2</p>
              <p>3</p>
              <p>4</p>
              <p>5</p>
              <p>6</p>
              <p>7</p>
              <p>8</p>
              <p>9</p>
              <p>10</p>
              <p>11</p>
            </div>
            <div className="text-[8px] sm:text-xs  flex-col gap-1.5 flex font-mono text-text-theme">
              <p>
                <span className="text-pink-700/70">from</span> preswald
                <span className="text-pink-700/70 mx-1">import</span>
                text , plotly, connect, get_df, table
              </p>
              <p>
                <span className="text-pink-700/70">import</span> pandas{" "}
                <span className="text-pink-700/70 ml-1">as</span> pd
              </p>
              <p className="text-white">invisible text</p>
              <p>
                connect
                <span className="text-yellow-500">{"()"}</span>
              </p>
              <p className="text-white">invisible text</p>
              <p>
                df = get_df
                <span className="text-yellow-500">{"("}</span>
                <span className="text-yellow-700">{"'sample_csv'"}</span>
                <span className="text-yellow-500">{")"}</span>
              </p>
              <p className="text-green-800"># Create a scatter plot</p>
              <p>
                fig = px.scatter
                <span className="text-yellow-700">
                  <span className="text-yellow-500">{"("}</span>
                  {"df, x='quantity', y='value', text='item',"}
                </span>
              </p>
              <p className="text-yellow-700">
                {"title='Quantity vs. Value', labels={'quantity': 'Quantity', "}
              </p>
              <p className="text-yellow-700">
                {"'value': 'Value'}"}
                <span className="text-yellow-500">{")"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
