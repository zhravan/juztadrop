import { useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useClickOutside } from './useClickOutside';
import { useAuth } from '@/lib/auth/use-auth';
import { useNgo } from '@/contexts/NgoContext';

function useHoverDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(false);
  }, []);

  const scheduleClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  const hoverHandlers = {
    onMouseEnter: openDropdown,
    onMouseLeave: scheduleClose,
  };

  return { open, ref, openDropdown, closeDropdown, scheduleClose, toggle, hoverHandlers };
}

export function useAppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { organizations, selectedOrgId, setSelectedOrgId, selectedOrg } = useNgo();

  const userMenu = useHoverDropdown();
  const ngoDropdown = useHoverDropdown();
  const myWorkDropdown = useHoverDropdown();

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  useClickOutside(menuRef, mobileMenuOpen, closeMenu);
  useClickOutside(userMenu.ref, userMenu.open, userMenu.closeDropdown);
  useClickOutside(ngoDropdown.ref, ngoDropdown.open, ngoDropdown.closeDropdown);
  useClickOutside(myWorkDropdown.ref, myWorkDropdown.open, myWorkDropdown.closeDropdown);

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);

  return {
    mobileMenuOpen,
    userMenuOpen: userMenu.open,
    ngoDropdownOpen: ngoDropdown.open,
    myWorkDropdownOpen: myWorkDropdown.open,
    menuRef,
    userMenuRef: userMenu.ref,
    ngoDropdownRef: ngoDropdown.ref,
    myWorkDropdownRef: myWorkDropdown.ref,
    userMenuHover: userMenu.hoverHandlers,
    ngoDropdownHover: ngoDropdown.hoverHandlers,
    myWorkDropdownHover: myWorkDropdown.hoverHandlers,
    pathname,
    user,
    logout,
    organizations,
    selectedOrgId,
    setSelectedOrgId,
    selectedOrg,
    closeMenu,
    closeUserMenu: userMenu.closeDropdown,
    toggleMobileMenu,
    toggleUserMenu: userMenu.toggle,
    toggleNgoDropdown: ngoDropdown.toggle,
    toggleMyWorkDropdown: myWorkDropdown.toggle,
    closeMyWorkDropdown: myWorkDropdown.closeDropdown,
  };
}
