import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Chain, useNetwork, useSwitchNetwork } from "wagmi";
import * as chains from "wagmi/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import scaffoldConfig from "~~/scaffold.config";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary shadow-md" : ""
      } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const { chains: switchChains, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const [chainData, setChainData] = useState<Chain[]>();

  const [selectedNetwork, setSelectedNetwork] = useState<string>("");

  function changeTargetNetwork(newNetwork: any): void {
    scaffoldConfig.targetNetwork = newNetwork;
  }

  console.log(switchChains);

  useEffect(() => {
    if (switchChains.length > 0) {
      setChainData(switchChains.filter(item => [1, 11155111, 137, 10].includes(item.id)));
    }
  }, [switchChains]);

  useEffect(() => {
    if (chain) {
      setSelectedNetwork(chain.name);
    }
  }, [chain]);

  const navLinks = (
    <>
      <li>
        <NavLink href="/">Home</NavLink>
      </li>
      <li>
        <NavLink href="/debug">
          <BugAntIcon className="h-4 w-4" />
          Debug Contracts
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky lg:static top-0 navbar  min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-new_primary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks}
            </ul>
          )}
        </div>

        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-[200px] h-[48px]">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/assets/bg.svg" />
          </div>
          {/* <div className="flex flex-col">
            <span className="font-bold leading-tight">Scaffold-ETH</span>
            <span className="text-xs">Ethereum dev stack</span>
          </div> */}
        </Link>
        {/* <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks}</ul> */}
      </div>
      <div className="navbar-end flex-grow mr-4 ">
        <select
          className="select select-sm sm:w-fit w-20 mr-2 bg-gray-600 text-white"
          style={{ borderWidth: 1, borderColor: chain && (chain as any).color }}
          onChange={event => {
            const [name, id] = event.target.value.split("|");
            switchNetwork?.(+id);
            console.log(name);
            name === "Ethereum"
              ? changeTargetNetwork(chains["mainnet"])
              : name === "Polygon Mumbai"
              ? changeTargetNetwork(chains["polygonMumbai"])
              : name === "OP Mainnet"
              ? changeTargetNetwork(chains["optimism"])
              : changeTargetNetwork(chains[name.toLowerCase() as keyof typeof chains]);
          }}
        >
          <option disabled>Select network</option>
          {chainData &&
            chainData.map(data => (
              <option
                key={data.name}
                value={`${data.name}|${data.id}`}
                style={{ color: (data as any).color }}
                selected={selectedNetwork === data.name}
              >
                {data.name}
              </option>
            ))}
        </select>
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
