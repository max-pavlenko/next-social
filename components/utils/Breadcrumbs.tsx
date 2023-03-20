import React from "react";
import { useRouter } from "next/router";
import { ROUTES } from "../../utils/constants";
import Link from "next/link";

const Breadcrumbs = () => {
  const { pathname, query } = useRouter();
  const queryKeys = Object.keys(query);

  const routesData = ROUTES.filter(({ path }) => {
    return pathname.includes(path);
  });

  const newRoutesData = routesData.map((route) => ({
    ...route,
    href: queryKeys.reduce((accum, currentValue) => accum.replace(`[${currentValue}]`, query[currentValue] as string), route.path)
  }));

  console.log("routesData", newRoutesData, routesData, query);

  return (
    <div>
      {newRoutesData.map(({ path, href, nameFn, name }, i) => {

        return (
          <div
            key={path}>
            <Link
              style={{color: i === newRoutesData.length - 1 ? "var(--color-border)" : "initial" }}
              href={href}>
              {name ? name : nameFn && nameFn(query)}
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;

// type numOrStr = number | string;
//
// function add(a: number, b: number): number
// function add(a: string, b: string): string
// function add(a:numOrStr, b: numOrStr) {
//   if (typeof a === "string" || typeof b === "string") return a.toString() + b.toString();
//   return a + b;
// }
//
// add('123', '123')
//
// function isString(value: unknown): value is string {
//   return typeof value === 'string'
// }
//
// const unkniwn: unknown = '';
// if(isString(unkniwn)){
//   unkniwn.toString();
// }