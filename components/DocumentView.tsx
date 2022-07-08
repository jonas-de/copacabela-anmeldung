import React, {useState} from 'react';
import {TeilnehmerIn} from '../payload-types';
import defaultFetch from '../utilitites/defaultFetch';
import {Checkbox, message} from 'antd';
import {
  ExceptionOutlined,
  FileImageOutlined,
  FileOutlined,
} from '@ant-design/icons';

const DocumentView: React.FC<{tn: TeilnehmerIn; isBevo: boolean}> = ({
  tn,
  isBevo,
}) => {
  const [anmeldung, setAnmeldung] = useState(tn.receivedRegistration);
  const [photo, setPhoto] = useState(tn.receivedPhotoPermission);
  const [leader, setLeader] = useState(tn.receivedLeaderInfo);

  const updateAnmeldung = async () => {
    const res = await defaultFetch(`/api/participants/${tn.id}`, 'PUT', {
      receivedRegistration: !anmeldung,
    });
    if (res.ok) {
      setAnmeldung(!anmeldung);
      message.success('Gespeichert');
    } else {
      message.error(await res.json());
    }
  };

  const updatePhoto = async () => {
    if (photo === 'never') {
      return;
    }
    const res = await defaultFetch(`/api/participants/${tn.id}`, 'PUT', {
      receivedPhotoPermission: photo === 'no' ? 'yes' : 'no',
    });
    if (res.ok) {
      setPhoto(photo === 'no' ? 'yes' : 'no');
      message.success('Gespeichert');
    } else {
      message.error(await res.json());
    }
  };

  const updateLeader = async () => {
    const res = await defaultFetch(`/api/participants/${tn.id}`, 'PUT', {
      receivedLeaderInfo: !leader,
    });
    if (res.ok) {
      setLeader(!leader);
      message.success('Gespeichert');
    } else {
      message.error(await res.json());
    }
  };

  return (
    <>
      <Checkbox
        disabled={!isBevo}
        checked={anmeldung}
        onClick={updateAnmeldung}
      >
        <FileOutlined />
      </Checkbox>
      <Checkbox
        disabled={!isBevo || photo === 'never'}
        checked={photo === 'yes'}
        onClick={updatePhoto}
      >
        <FileImageOutlined />
      </Checkbox>
      {tn.role !== 'participant' && (
        <Checkbox disabled={!isBevo} checked={leader} onClick={updateLeader}>
          <ExceptionOutlined />
        </Checkbox>
      )}
    </>
  );
};

export default DocumentView;
