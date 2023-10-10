import { type Component } from "solid-js";
import { DragDropProvider, DragDropSensors } from "@thisbeyond/solid-dnd";
import { Sandbox } from "../canvas/Sandbox";

export const MindsightCanvas: Component<{}> = (props) => {
  return (
    <DragDropProvider>
      <DragDropSensors />
      <Sandbox width="100%" height="100%" />
    </DragDropProvider>
  );
};
