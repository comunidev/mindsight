import type { JSX } from "solid-js/jsx-runtime";

export function RiDraggable(props: JSX.IntrinsicElements["svg"], key: string) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
      key={key}
    >
      <path
        fill="currentColor"
        d="M8.5 7a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Zm0 6.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Zm1.5 5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0ZM15.5 7a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Zm1.5 5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Zm-1.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3Z"
      ></path>
    </svg>
  );
}
