<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class notifications
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=512, nullable=true)
     */
    private $if_any_related_photo_path;

    /**
     * @ORM\Column(type="string", length=1024, nullable=true)
     */
    private $notification_text;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $is_read;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $time_stamp;

    /**
     * @ORM\Column(type="date", nullable=false)
     */
    private $datee;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $wallpost_id ;

    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $socialize_photo_id ;
    
    /**
     * @ORM\Column(type="integer", length=11, nullable=true)
     */
    private $socialize_album_id;
    /**
     * @ORM\ManyToOne(targetEntity="Entities\notification_type", inversedBy="notifications")
     * @ORM\JoinColumn(name="notification_type_id", referencedColumnName="id")
     */
    private $notificationType;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="forIlookUserNotifications")
     * @ORM\JoinColumn(name="for_ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $forIlookUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="aboutIlookUserNotifications")
     * @ORM\JoinColumn(name="about_ilook_user_id", referencedColumnName="id")
     */
    private $aboutIlookUser;
    
    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $is_seen;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getIf_any_related_photo_path() {
		return $this->if_any_related_photo_path;
	}

	public function setIf_any_related_photo_path($if_any_related_photo_path) {
		$this->if_any_related_photo_path = $if_any_related_photo_path;
	}

	public function getNotification_text() {
		return $this->notification_text;
	}

	public function setNotification_text($notification_text) {
		$this->notification_text = $notification_text;
	}

	public function getIs_read() {
		return $this->is_read;
	}

	public function setIs_read($is_read) {
		$this->is_read = $is_read;
	}

	public function getTime_stamp() {
		return $this->time_stamp;
	}

	public function setTime_stamp($time_stamp) {
		$this->time_stamp = $time_stamp;
	}

	public function getDatee() {
		return $this->datee;
	}

	public function setDatee($datee) {
		$this->datee = $datee;
	}

	public function getWallpost_id() {
		return $this->wallpost_id;
	}

	public function setWallpost_id($wallpost_id) {
		$this->wallpost_id = $wallpost_id;
	}

	public function getSocialize_photo_id() {
		return $this->socialize_photo_id;
	}

	public function setSocialize_photo_id($socialize_photo_id) {
		$this->socialize_photo_id = $socialize_photo_id;
	}
	public function getSocialize_album_id() {
		return $this->socialize_album_id;
	}

	public function setSocialize_album_id($socialize_album_id) {
		$this->socialize_album_id = $socialize_album_id;
	}

	public function getNotificationType() {
		return $this->notificationType;
	}

	public function setNotificationType($notificationType) {
		$this->notificationType = $notificationType;
	}

	public function getForIlookUser() {
		return $this->forIlookUser;
	}

	public function setForIlookUser($forIlookUser) {
		$this->forIlookUser = $forIlookUser;
	}

	public function getAboutIlookUser() {
		return $this->aboutIlookUser;
	}

	public function setAboutIlookUser($aboutIlookUser) {
		$this->aboutIlookUser = $aboutIlookUser;
	}
	public function getIs_seen() {
		return $this->is_seen;
	}

	public function setIs_seen($is_seen) {
		$this->is_seen = $is_seen;
	}
}