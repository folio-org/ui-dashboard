import PropTypes from 'prop-types';
import { useDashboardAccess } from '../../hooks';

const IfHasAccess = ({
  access,
  dashId,
  children,
}) => {
  const { hasAccess, hasAdminPerm } = useDashboardAccess(dashId);

  if (hasAccess(access) || hasAdminPerm) {
    return children;
  }

  return null;
};

export default IfHasAccess;

IfHasAccess.propTypes = {
  access: PropTypes.string.isRequired,
  dashId: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};
