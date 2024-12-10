import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgGithubCircleSolidRounded = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    color="currentColor"
    viewBox="0 0 24 24"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="currentColor"
      d="M9.941 17.88c0-.363.108-.679.283-.964.12-.196.037-.474-.179-.535C8.255 15.873 7 15.056 7 12.345c0-.704.224-1.367.617-1.944.097-.143.145-.208.158-.28.013-.071-.009-.15-.05-.32a3.65 3.65 0 0 1 .006-1.81c.053-.193.166-.305.37-.284.266.029.727.154 1.409.595.268.173.402.26.52.278.118.02.276-.02.592-.102.432-.11.877-.17 1.378-.17s.946.06 1.378.17c.316.081.474.122.592.102.118-.019.252-.105.52-.278.682-.44 1.143-.566 1.408-.595.205-.021.318.091.371.284.16.586.15 1.214.006 1.81-.041.17-.063.249-.05.32s.06.137.158.28c.393.577.617 1.24.617 1.944 0 2.71-1.255 3.528-3.045 4.036-.216.061-.298.34-.179.535.175.285.283.601.283.965v4.77c4.952-.96 8.691-5.32 8.691-10.552 0-5.937-4.813-10.75-10.75-10.75S1.25 6.162 1.25 12.099c0 5.233 3.739 9.592 8.691 10.553v-2.8a3 3 0 0 1-.199-.03 4 4 0 0 1-.845-.27c-.682-.303-1.534-.885-2.36-1.985a.75.75 0 1 1 1.2-.9c.674.898 1.324 1.316 1.768 1.513.177.079.326.124.436.15z"
    />
  </svg>
);
export default SvgGithubCircleSolidRounded;