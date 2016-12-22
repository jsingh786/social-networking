<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class notification_settings
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $email_on_link_req;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $email_on_feedback_req;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $email_on_ref_req;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $email_on_job_invite;

    /**
     * @ORM\Column(type="boolean", nullable=false)
     */
    private $general_notifications;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="notificationSettings")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilookUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getEmail_on_link_req() {
		return $this->email_on_link_req;
	}

	public function setEmail_on_link_req($email_on_link_req) {
		$this->email_on_link_req = $email_on_link_req;
	}

	public function getEmail_on_feedback_req() {
		return $this->email_on_feedback_req;
	}

	public function setEmail_on_feedback_req($email_on_feedback_req) {
		$this->email_on_feedback_req = $email_on_feedback_req;
	}

	public function getEmail_on_ref_req() {
		return $this->email_on_ref_req;
	}

	public function setEmail_on_ref_req($email_on_ref_req) {
		$this->email_on_ref_req = $email_on_ref_req;
	}

	public function getEmail_on_job_invite() {
		return $this->email_on_job_invite;
	}

	public function setEmail_on_job_invite($email_on_job_invite) {
		$this->email_on_job_invite = $email_on_job_invite;
	}

	public function getGeneral_notifications() {
		return $this->general_notifications;
	}

	public function setGeneral_notifications($general_notifications) {
		$this->general_notifications = $general_notifications;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}