<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;

/**
 * @ORM\Entity
 */
class message
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $subject;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $contents;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $msg_type;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $hide_reply_forward_opt;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $link_req_id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $ref_req_id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $feedbk_req_id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $job_id;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $wallpost_id;


	/**
	 * @ORM\Column(type="integer", length=11, nullable=true)
	 */
	private $photo_id;


	/**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $reported_abuse_wallpost_id;
    
    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $enquiry_id;
    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $contents_json;
    

    /**
     * @ORM\OneToMany(targetEntity="Entities\message_attachment", mappedBy="message_attachmentsMessage")
     */
    private $messageMessage_attachment;

    /**
     * @ORM\OneToMany(targetEntity="Entities\message_user", mappedBy="message_usersMessage")
     */
    private $MessagesMessage_user;

    /**
     * @ORM\OneToMany(targetEntity="Entities\message_folder", mappedBy="message_foldersMessage")
     */
    private $MessagesMessage_folder;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersMessage")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $messagesUser;
    
    /**
     * @var datetime $created_at
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created_at;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getSubject() {
		return $this->subject;
	}

	public function setSubject($subject) {
		$this->subject = $subject;
	}

	public function getContents() {
		return $this->contents;
	}

	public function setContents($contents) {
		$this->contents = $contents;
	}

	public function getMsg_type() {
		return $this->msg_type;
	}

	public function setMsg_type($msg_type) {
		$this->msg_type = $msg_type;
	}

	public function getHide_reply_forward_opt() {
		return $this->hide_reply_forward_opt;
	}

	public function setHide_reply_forward_opt($hide_reply_forward_opt) {
		$this->hide_reply_forward_opt = $hide_reply_forward_opt;
	}

	public function getLink_req_id() {
		return $this->link_req_id;
	}

	public function setLink_req_id($link_req_id) {
		$this->link_req_id = $link_req_id;
	}

	public function getRef_req_id() {
		return $this->ref_req_id;
	}

	public function setRef_req_id($ref_req_id) {
		$this->ref_req_id = $ref_req_id;
	}

	public function getFeedbk_req_id() {
		return $this->feedbk_req_id;
	}

	public function setFeedbk_req_id($feedbk_req_id) {
		$this->feedbk_req_id = $feedbk_req_id;
	}

	public function getJob_id() {
		return $this->job_id;
	}

	public function setJob_id($job_id) {
		$this->job_id = $job_id;
	}

	public function getWallpost_id()
	{
		return $this->wallpost_id;
	}

	public function setWallpost_id($wallpost_id) {
		$this->wallpost_id = $wallpost_id;
	}

	public function getPhotoId()
	{
		return $this->photo_id;
	}

	public function setPhotoId($photo_id)
	{
		$this->photo_id = $photo_id;
	}

	public function getReported_abuse_wallpost_id() {
		return $this->reported_abuse_wallpost_id;
	}

	public function setReported_abuse_wallpost_id($reported_abuse_wallpost_id) {
		$this->reported_abuse_wallpost_id = $reported_abuse_wallpost_id;
	}

	public function getEnquiry_id() {
		return $this->enquiry_id;
	}

	public function setEnquiry_id($enquiry_id) {
		$this->enquiry_id = $enquiry_id;
	}

	public function getMessageMessage_attachment() {
		return $this->messageMessage_attachment;
	}

	public function setMessageMessage_attachment($messageMessage_attachment) {
		$this->messageMessage_attachment = $messageMessage_attachment;
	}

	public function getMessagesMessage_user() {
		return $this->MessagesMessage_user;
	}

	public function setMessagesMessage_user($MessagesMessage_user) {
		$this->MessagesMessage_user = $MessagesMessage_user;
	}

	public function getMessagesMessage_folder() {
		return $this->MessagesMessage_folder;
	}

	public function setMessagesMessage_folder($MessagesMessage_folder) {
		$this->MessagesMessage_folder = $MessagesMessage_folder;
	}

	public function getMessagesUser() {
		return $this->messagesUser;
	}

	public function setMessagesUser($messagesUser) {
		$this->messagesUser = $messagesUser;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}
	
	public function getContents_json() {
		return $this->contents_json;
	}

	public function setContents_json($contents_json) {
		$this->contents_json = $contents_json;
	}

}