import {
  ensurePopover,
  ensureTarget,
  usePopover
} from "@BUTTERY_COMPONENT/usePopover";
import { type RefCallback, useCallback } from "react";
import type { DropdownOptions } from "./useDropdown.types";
import {
  getIsDropdownOpen,
  processDropdownOptions,
  setDropdownPositionStyles
} from "./useDropdown.utils";

export type DropdownRefHandleOpen = (
  e?: React.MouseEvent,
  options?: UseDropdownOptions
) => void;

export type DropdownRef = {
  handleOpen: DropdownRefHandleOpen;
  handleClose: () => void;
  handleToggle: DropdownRefHandleOpen;
};

export type UseDropdownOptions = DropdownOptions & { id: string };

export const useDropdown = <T extends HTMLElement>(
  options: UseDropdownOptions
) => {
  const {
    popoverRef,
    targetRef,
    setPopoverRef,
    setTargetRef,
    showPopover,
    hidePopover
  } = usePopover<T>({ id: options.id });

  const setDropdownRef = useCallback<RefCallback<T>>(
    (node) => {
      setPopoverRef(node);
      // add a few more styles specific to the dropdown version of the popover
      if (ensurePopover(popoverRef.current)) {
        popoverRef.current.style.position = "fixed";
        popoverRef.current.style.inset = "unset";
      }
    },
    [setPopoverRef, popoverRef.current]
  );

  const openDropdown = useCallback<DropdownRef["handleOpen"]>(
    (_e, pOptions) => {
      if (
        !ensurePopover(popoverRef.current) ||
        !ensureTarget(targetRef.current)
      ) {
        return;
      }

      // apply the options either from the hook or
      // from the params which take precedence.
      const parsedOptions = processDropdownOptions(pOptions ?? options);

      // show the popover
      showPopover();

      // position the dropdown element near the target
      setDropdownPositionStyles(parsedOptions.dxPosition, {
        arrow: parsedOptions.dxArrow,
        offset: parsedOptions.dxOffset,
        dropdownNode: popoverRef.current,
        targetNode: targetRef.current
      });
    },
    [targetRef.current, popoverRef.current, showPopover, options]
  );

  const closeDropdown = useCallback(async () => {
    const isPopoverOpen = getIsDropdownOpen(popoverRef);
    if (!isPopoverOpen) return;
    await hidePopover();
  }, [hidePopover, popoverRef]);

  const toggleDropdown = useCallback<DropdownRefHandleOpen>(
    (e, options) => {
      const isPopoverOpen = getIsDropdownOpen(popoverRef);
      if (isPopoverOpen) {
        return closeDropdown();
      }
      openDropdown(e, options);
    },
    [closeDropdown, openDropdown, popoverRef]
  );

  return {
    dropdownRef: popoverRef,
    setDropdownRef,
    targetRef,
    setTargetRef,
    closeDropdown,
    openDropdown,
    toggleDropdown
  };
};
