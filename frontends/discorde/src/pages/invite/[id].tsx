import * as React from 'react';
import Router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { joinServer } from 'api/servers';
import { useDispatch } from 'react-redux';

const Invite = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const join = async () => {
    const response = await joinServer(dispatch, id as string);
    if (response.success) {
      Router.replace(`/channels/${response.data.id}/${response.data.channels[0].id}`);
    } else {
      setError(true);
    }
  }

  useEffect(() => {
    join();
  }, []);

  return (
    <div>
      {
        error ? 
          'Error' :
          'Joining server...'
      }
    </div>
  )
}

export default Invite;