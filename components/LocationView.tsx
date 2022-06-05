import React, { useState } from 'react';
import { TeilnehmerIn } from '../payload-types';
import { getLocation, LocationText } from '../utilitites/Wording';
import defaultFetch from '../utilitites/defaultFetch';
import { Button, message, Tag } from 'antd';
import { LinkOutlined, LoginOutlined, LogoutOutlined, PauseOutlined } from '@ant-design/icons';

const LocationView: React.FC<{ tn: TeilnehmerIn, isBevo: boolean }> = ({ tn, isBevo }) => {
  const [location, setLocation] = useState(tn.location)

  const updateLocation = async (newLocation: LocationText) => {
    const res = await defaultFetch(`/api/participants/${tn.id}`, "PUT", {
      location: newLocation
    })
    if (res.ok) {
      setLocation(newLocation)
      message.success("Gespeichert")
    } else {
      message.error(await res.json())
    }
  }

  return (<>
    <Tag color={getLocation(location).color} style={{ paddingRight: 8 }}>
      { getLocation(location).name }
    </Tag>
    { (isBevo && location !== "onsite") &&
      <Button icon={<LoginOutlined />} onClick={() => updateLocation("onsite")} />
    }
    { (isBevo && location === "onsite") &&
      <>
        <Button icon={<PauseOutlined />} onClick={() => updateLocation("offsite")} />
        <Button icon={<LogoutOutlined />} onClick={() => updateLocation("backHome")} />
      </>
    }
    { (isBevo && tn.wristband !== undefined) &&
      <LinkOutlined style={{ paddingLeft: 4 }}/>
    }
  </>)
}

export default LocationView