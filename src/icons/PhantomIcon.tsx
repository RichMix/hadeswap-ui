import React from 'react';

const Icon = (
  <>
    <g clipPath="url(#clip0_400_5431)">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="url(#paint0_linear_400_5431)"
      />
      <path
        d="M20.5908 12.1462H18.4753C18.4753 7.83505 14.9683 4.34039 10.6418 4.34039C6.36892 4.34039 2.895 7.7495 2.80998 11.9868C2.72202 16.3668 6.84587 20.1702 11.242 20.1702H11.795C15.6707 20.1702 20.8654 17.147 21.677 13.4634C21.8269 12.7844 21.2886 12.1462 20.5908 12.1462ZM7.49815 12.3382C7.49815 12.9147 7.02494 13.3863 6.44638 13.3863C5.86781 13.3863 5.39463 12.9145 5.39463 12.3382V10.6428C5.39463 10.0663 5.86781 9.59475 6.44638 9.59475C7.02494 9.59475 7.49815 10.0663 7.49815 10.6428V12.3382ZM11.1502 12.3382C11.1502 12.9147 10.6771 13.3863 10.0986 13.3863C9.51994 13.3863 9.04679 12.9145 9.04679 12.3382V10.6428C9.04679 10.0663 9.52015 9.59475 10.0986 9.59475C10.6771 9.59475 11.1502 10.0663 11.1502 10.6428V12.3382Z"
        fill="url(#paint1_linear_400_5431)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_400_5431"
        x1="12"
        y1="0"
        x2="12"
        y2="24"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#534BB1" />
        <stop offset="1" stopColor="#551BF9" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_400_5431"
        x1="12.2554"
        y1="4.34039"
        x2="12.2554"
        y2="20.1702"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="white" stopOpacity="0.82" />
      </linearGradient>
      <clipPath id="clip0_400_5431">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </>
);

const PhantomIcon = ({
  className,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {Icon}
  </svg>
);

export default PhantomIcon;
