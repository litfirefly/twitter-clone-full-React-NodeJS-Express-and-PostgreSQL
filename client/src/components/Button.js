import PropTypes from 'prop-types';
import Spinner from './Spinner';

const Button = ({ type, isLoading, onClick, children }) => {
  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className="font-raleway bg-primary text-on-primary rounded-full font-semibold block w-full py-4"
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
};

Button.defaultProps = {
  type: 'submit',
  isLoading: false,
  onClick: () => {},
};

export default Button;
