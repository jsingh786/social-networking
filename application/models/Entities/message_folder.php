<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class message_folder
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $mark_read;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $mark_seen;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\user_folder", inversedBy="user_foldersMessage_folder")
     * @ORM\JoinColumn(name="user_folder_id", referencedColumnName="id", nullable=false)
     */
    private $message_foldersUser_folder;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\message", inversedBy="MessagesMessage_folder")
     * @ORM\JoinColumn(name="message_id", referencedColumnName="id", nullable=false)
     */
    private $message_foldersMessage;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\message_user", inversedBy="message_usersMessage_folder")
     * @ORM\JoinColumn(name="message_user_id", referencedColumnName="id", nullable=false)
     */
    private $message_foldersMessage_user;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getMark_read() {
		return $this->mark_read;
	}

	public function setMark_read($mark_read) {
		$this->mark_read = $mark_read;
	}

	public function getMark_seen() {
		return $this->mark_seen;
	}

	public function setMark_seen($mark_seen) {
		$this->mark_seen = $mark_seen;
	}

	public function getMessage_foldersUser_folder() {
		return $this->message_foldersUser_folder;
	}

	public function setMessage_foldersUser_folder($message_foldersUser_folder) {
		$this->message_foldersUser_folder = $message_foldersUser_folder;
	}

	public function getMessage_foldersMessage() {
		return $this->message_foldersMessage;
	}

	public function setMessage_foldersMessage($message_foldersMessage) {
		$this->message_foldersMessage = $message_foldersMessage;
	}

	public function getMessage_foldersMessage_user() {
		return $this->message_foldersMessage_user;
	}

	public function setMessage_foldersMessage_user($message_foldersMessage_user) {
		$this->message_foldersMessage_user = $message_foldersMessage_user;
	}

}