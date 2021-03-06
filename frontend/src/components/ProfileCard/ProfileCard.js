import React from 'react';
import {Link, withRouter} from 'react-router-dom';

import {Card, Image, Button} from 'semantic-ui-react';

const ProfileCard = (props) => {
	return (
		<Card>
			<Image src={props.pictureUrl} size={'medium'} centered/>
			<Card.Content textAlign={'center'}>
				<Card.Header>{props.name}</Card.Header>
				<Card.Meta>
					<span>{props.metaInfo}</span>
				</Card.Meta>
				<Card.Description>
					{props.shortDescription}
				</Card.Description>
			</Card.Content>
			<Card.Content extra textAlign={'center'}>
				<Button as={Link} to={`${props.match.url}/${props.index}`}>View Portfolio</Button>
			</Card.Content>
		</Card>
	)
};

export default withRouter(ProfileCard);