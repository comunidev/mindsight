import type { JSX } from "solid-js";

export function CodiconGrabber(
  props: JSX.IntrinsicElements["svg"],
  key: string
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M15 6H1v1h14V6zm0 3H1v1h14V9z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
export default CodiconGrabber;
