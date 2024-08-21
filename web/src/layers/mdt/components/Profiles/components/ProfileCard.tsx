import React from 'react';
import { Divider, Text } from '@mantine/core';
import '../index.css';

interface Props {
  title: string;
  icon: React.ComponentType | string;
  children: React.ReactNode;
}

const ProfileCard: React.FC<Props> = (props) => {
  return (
    <div className='card-background profile-card-info'>
      <div className='card-title'>
        <Text style={{ fontSize: 17, color: "white" }} weight={500}>
          {props.title}
        </Text>

        {typeof props.icon === 'string' ? (
          <i className={`ti ti-${props.icon}`} style={{ fontSize: 24, color: 'white' }} />
        ) : (
          <props.icon />
        )}
      </div>

      <Divider style={{ width: '100%' }} />

      <div className='profile-card-info-badges'>
        {props.children}
      </div>
    </div>
  );
};

export default ProfileCard;