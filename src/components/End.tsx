import { AspectRatio } from '@mantine/core'
import ReactPlayer from 'react-player';

interface Props {
    setActions: (action: string) => void; 
    setUserName: (name: string) => void; 
}

const End = (props: Props) => {
    const { setActions, setUserName } = props;

     // Función que se llama cuando el video termina
    const handleVideoEnd = () => {
        setTimeout(() => {
        setActions('');
        setUserName('');
        }, 500); 
    };

    return (
        <AspectRatio 
          ratio={9 / 16} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
            <ReactPlayer 
                url={'../assets/Cierre.mp4'}
                playing={true}
                muted={true}
                onEnded={handleVideoEnd}
                height={'100%'}
                width={'100%'}
                style={{ objectFit: 'cover' }}
            />
        </AspectRatio>
    )
}

export default End;