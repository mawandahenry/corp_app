import PropTypes from 'prop-types';

const ShouldRender = ({visible, children}) => {
  return visible ? children : null;
};

ShouldRender.propTypes = {
  children: PropTypes.element,
  visible: (props, propName, componentName) => {
    const value = props[propName];
    if (value === null) {
      return;
    }
    if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      typeof value === 'object'
    ) {
      return;
    }
    return new Error(`${componentName} only accepts null, boolean or string`);
  },
};

ShouldRender.defaultProps = {
  visible: null,
};

export default ShouldRender;
