import { sample } from "lodash-es";

const Button = sample<JSX.Element>([
  <a
    key="donation"
    href="https://ko-fi.com/Cside"
    target="_blank"
    className="btn btn-outline btn-primary flex columns-3 gap-x-1 px-3"
    rel="noreferrer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#fc3e30"
      viewBox="0 0 16 16"
    >
      <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1" />
    </svg>
    Donation
  </a>,
  <a
    key="review"
    href="FIXME"
    target="_blank"
    className="btn btn-outline btn-primary flex columns-3 gap-x-1 px-3"
    rel="noreferrer"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="#ffdd02"
      viewBox="0 0 16 16"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
    Rate it
  </a>,
]);

export const DonationOrReviewButton = (): JSX.Element => Button;
