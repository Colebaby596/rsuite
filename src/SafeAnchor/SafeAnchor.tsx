import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCustom } from '../CustomProvider';
import type { WithAsProps, RsRefForwardingComponent } from '@/internals/types';

export interface SafeAnchorProps extends WithAsProps, React.HTMLAttributes<HTMLElement> {
  /** Link specified url */
  href?: string;

  /** A link can show it is currently unable to be interacted with */
  disabled?: boolean;
}

function isTrivialHref(href: string | undefined) {
  return !href || href.trim() === '#';
}

/**
 * A SafeAnchor is a wrapper around the `<a>` HTML element.
 * @private
 */
const SafeAnchor: RsRefForwardingComponent<'a', SafeAnchorProps> = React.forwardRef(
  (props: SafeAnchorProps, ref) => {
    const { propsWithDefaults } = useCustom('SafeAnchor', props);
    const { as: Component = 'a', href, disabled, onClick, ...restProps } = propsWithDefaults;
    const handleClick = useCallback(
      event => {
        if (disabled || isTrivialHref(href)) {
          event.preventDefault();
        }

        if (disabled) {
          event.stopPropagation();
          return;
        }

        onClick?.(event);
      },
      [disabled, href, onClick]
    );

    // There are default role and href attributes on the node to ensure Focus management and keyboard interactions.
    const trivialProps = isTrivialHref(href) ? { role: 'button', href: '#' } : null;

    if (disabled) {
      restProps.tabIndex = -1;
      restProps['aria-disabled'] = true;
    }

    return (
      <Component ref={ref} href={href} {...trivialProps} {...restProps} onClick={handleClick} />
    );
  }
);

SafeAnchor.displayName = 'SafeAnchor';
SafeAnchor.propTypes = {
  href: PropTypes.string,
  disabled: PropTypes.bool,
  as: PropTypes.elementType
};

export default SafeAnchor;
