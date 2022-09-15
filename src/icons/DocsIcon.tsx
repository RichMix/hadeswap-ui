import React from 'react';

const icon = (
  <>
    <rect width="24" height="24" fill="white" />
    <path
      d="M10.5955 16.6996C10.9337 16.6996 11.1366 16.9719 11.1366 17.2441C11.1366 17.5844 10.8661 17.7886 10.5955 17.7886C10.2573 17.7886 10.0544 17.5164 10.0544 17.2441C10.0544 16.9719 10.2573 16.6996 10.5955 16.6996ZM19.4565 13.2286C19.1183 13.2286 18.9154 12.9564 18.9154 12.6841C18.9154 12.4119 19.1859 12.1397 19.4565 12.1397C19.7947 12.1397 19.9976 12.4119 19.9976 12.6841C19.9976 12.9564 19.7271 13.2286 19.4565 13.2286ZM19.4565 10.9146C18.5095 10.9146 17.6978 11.7313 17.6978 12.6841C17.6978 12.8883 17.6978 13.0925 17.7655 13.2286L12.016 16.2913C11.6778 15.8149 11.1366 15.5426 10.5955 15.5426C9.91911 15.5426 9.31034 15.951 9.03978 16.4955L3.89906 13.7731C3.35794 13.5008 2.95209 12.548 3.01973 11.7313C3.01973 11.3229 3.22265 10.9826 3.42558 10.8465C3.56086 10.7785 3.76378 10.7785 3.89906 10.8465H3.9667C5.31952 11.5952 9.85147 13.9092 9.98675 14.0453C10.2573 14.1814 10.4602 14.2495 10.9337 13.9773L20.2005 9.14504C20.3358 9.07698 20.4711 8.94086 20.4711 8.73668C20.4711 8.46444 20.2005 8.32832 20.2005 8.32832C19.6594 8.05609 18.8477 7.71579 18.1037 7.30743C16.6204 6.59382 15.1323 5.89052 13.6394 5.19758C12.8953 4.78923 12.3542 5.12953 12.2189 5.19758L12.016 5.26564C8.22808 7.17131 3.15501 9.68951 2.88445 9.82563C2.34332 10.1659 2.07276 10.7785 2.00512 11.5271C1.93748 12.7522 2.54624 14.0453 3.49322 14.5217L8.97214 17.3802C9.10742 18.265 9.85147 18.8776 10.6632 18.8776C11.6101 18.8776 12.4218 18.1289 12.4218 17.1761L18.4419 13.9092C18.7801 14.1814 19.1183 14.2495 19.5241 14.2495C20.4711 14.2495 21.2828 13.4328 21.2828 12.48C21.1475 11.6632 20.4035 10.9146 19.4565 10.9146Z"
      fill="black"
    />
  </>
);

const DocsIcon = ({
  className,
  width,
}: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    className={className || ''}
    width={width || '24'}
    viewBox="0 0 24 24"
    fill="none"
  >
    {icon}
  </svg>
);

export default DocsIcon;
