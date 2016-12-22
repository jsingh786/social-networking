<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class message_user
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="Entities\message_folder", mappedBy="message_foldersMessage_user")
     */
    private $message_usersMessage_folder;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="senderUsersMessage_user")
     * @ORM\JoinColumn(name="sender_id", referencedColumnName="id", nullable=false)
     */
    private $message_usersSenderUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="recieverUsersMessage_user")
     * @ORM\JoinColumn(name="receiver_id", referencedColumnName="id", nullable=false)
     */
    private $message_usersRecieverUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\message", inversedBy="MessagesMessage_user")
     * @ORM\JoinColumn(name="message_id", referencedColumnName="id", nullable=false)
     */
    private $message_usersMessage;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getMessage_usersMessage_folder() {
		return $this->message_usersMessage_folder;
	}

	public function setMessage_usersMessage_folder($message_usersMessage_folder) {
		$this->message_usersMessage_folder = $message_usersMessage_folder;
	}

	public function getMessage_usersSenderUser() {
		return $this->message_usersSenderUser;
	}

	public function setMessage_usersSenderUser($message_usersSenderUser) {
		$this->message_usersSenderUser = $message_usersSenderUser;
	}

	public function getMessage_usersRecieverUser() {
		return $this->message_usersRecieverUser;
	}

	public function setMessage_usersRecieverUser($message_usersRecieverUser) {
		$this->message_usersRecieverUser = $message_usersRecieverUser;
	}

	public function getMessage_usersMessage() {
		return $this->message_usersMessage;
	}

	public function setMessage_usersMessage($message_usersMessage) {
		$this->message_usersMessage = $message_usersMessage;
	}

}