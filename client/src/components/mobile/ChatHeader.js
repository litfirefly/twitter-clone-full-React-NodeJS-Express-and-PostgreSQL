import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import { IconContext } from 'react-icons';

import useChat from '../../hooks/useChat';

const ChatHeader = ({ onClose }) => {
  const { chatId } = useParams();

  const { data, isSuccess } = useChat(chatId);

  return (
    <div className="px-4 py-2 sticky top-0 backdrop-blur-sm">
      <div className="flex justify-between items-center gap-3">
        <div>
          <button type="button" onClick={onClose} className="text-on-surface">
            <IconContext.Provider
              // eslint-disable-next-line react/jsx-no-constructed-context-values
              value={{
                size: '18px',
                style: {
                  color: 'inherit',
                },
              }}
            >
              <RiArrowLeftLine />
            </IconContext.Provider>
          </button>
        </div>
        <div className="flex flex-1 items-center gap-2">
          <div className="h-6 w-6 overflow-hidden">
            <img
              className="h-full w-full rounded-full object-cover"
              src="https://i.pravatar.cc/300"
              alt="avatar"
            />
          </div>
          <div>
            <h3 className="text-on-surface font-bold text-base">
              {isSuccess && data.chat.participant.profile.name}
            </h3>
            <h5 className="text-on-surface/70 text-xs">
              @{isSuccess && data.chat.participant.username}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChatHeader;
