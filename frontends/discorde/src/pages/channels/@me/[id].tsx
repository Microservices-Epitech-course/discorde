import { useRouter } from 'next/router';

const PrivateMessage = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  return <div>PrivateMessage: {id}</div>;
};

export default PrivateMessage;
