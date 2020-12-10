import { useRouter } from 'next/router';

const Channel = (): JSX.Element => {
  const router = useRouter();
  const { serverId, id } = router.query;
  return (
    <div>
      <div>Server: {serverId}</div>
      <div>Channel: {id}</div>
    </div>
  );
};

export default Channel;
