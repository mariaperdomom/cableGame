import { AspectRatio } from '@mantine/core'
import ReactPlayer from 'react-player';

interface Props {
    setActions: (action: string) => void; 
}

const Welcome = (props: Props) => {
    const { setActions } = props;

    return (
        <AspectRatio 
          ratio={9 / 16} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={()=> setActions('register')}
        >
          <ReactPlayer 
            url={'../assets/Intro.mp4'}
            playing={true}
            muted={true}
            loop={true}
            height={'100%'}
            width={'100%'}
            style={{ objectFit: 'cover' }}
          />
        </AspectRatio>
    )
}

export default Welcome;