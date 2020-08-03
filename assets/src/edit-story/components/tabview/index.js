/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import styled from 'styled-components';
import { useRef, useState, useCallback } from 'react';
import { rgba } from 'polished';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import { useKeyDownEffect } from '../keyboard';

const Tabs = styled.ul.attrs({
  role: 'tablist',
  'aria-orientation': 'horizontal',
})`
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin: 0;
  padding: 0;
  list-style: none;
  border-bottom: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.04)};
`;

const Tab = styled.li.attrs(({ isActive }) => ({
  tabIndex: isActive ? 0 : -1,
  role: 'tab',
  'aria-selected': isActive,
}))`
  text-align: center;
  cursor: pointer;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.fg.white};
  font-family: ${({ theme }) => theme.fonts.tab.family};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  font-weight: ${({ theme }) => theme.fonts.tab.weight};
  word-break: break-word;
  opacity: 0.84;
  padding: 12px 0px;
  margin: 0px 16px;
  margin-bottom: -1px;
  outline: none;

  ${({ isActive }) =>
    !isActive &&
    `
		opacity: .34;
		&:hover { opacity: 1; }
	`}

  ${({ isActive, theme }) =>
    isActive &&
    `
		border-bottom: 1px solid ${theme.colors.accent.primary};
	`}

  &:active,
	&:hover {
    opacity: 0.84;
  }

  svg {
    display: block;
    width: 28px;
    height: 28px;
    transform-origin: center center;
    transition: transform 0.3s ease;
  }
`;

function TabView({
  getTabId = (id) => id,
  onTabChange = () => {},
  tabs = [],
  initialTab,
}) {
  const [tab, setTab] = useState(initialTab || tabs[0]?.id);
  const { isRTL } = useConfig();

  const ref = useRef();

  const tabChanged = useCallback(
    (id) => {
      setTab(id);
      onTabChange(id);
    },
    [setTab, onTabChange]
  );

  const handleNavigation = useCallback(
    (direction) => {
      const currentIndex = tabs.findIndex(({ id }) => id === tab);
      const nextTab = tabs[currentIndex + direction];
      if (!nextTab) {
        return;
      }
      tabChanged(nextTab.id);
    },
    [tab, tabs, tabChanged]
  );
  useKeyDownEffect(ref, 'left', () => handleNavigation(isRTL ? 1 : -1), [
    handleNavigation,
    isRTL,
  ]);
  useKeyDownEffect(ref, 'right', () => handleNavigation(isRTL ? -1 : 1), [
    handleNavigation,
    isRTL,
  ]);
  // Empty up/down handlers for consistency with left/right.
  useKeyDownEffect(ref, ['up', 'down'], () => {}, []);

  return (
    <Tabs ref={ref}>
      {tabs.map(({ id, title, icon: Icon }) => (
        <Tab
          key={id}
          id={id}
          isActive={tab === id}
          aria-controls={getTabId(id)}
          aria-selected={tab === id}
          onClick={() => tabChanged(id)}
        >
          {title}
          {Boolean(Icon) && <Icon isActive={id === tab} />}
        </Tab>
      ))}
    </Tabs>
  );
}

TabView.propTypes = {
  getTabId: PropTypes.func,
  onTabChange: PropTypes.func,
  tabs: PropTypes.array.isRequired,
  initialTab: PropTypes.any,
};

export default TabView;
