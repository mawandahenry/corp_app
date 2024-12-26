import {HTTP_STATUS} from '../utils/constants';

const Suspense = ({fallback, loading, children}) => {
  return loading === HTTP_STATUS.PENDING ? fallback : children;
};

export default Suspense;
