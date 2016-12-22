<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class event_comments
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=2000, nullable=false)
     */
    private $msg_text;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\events", inversedBy="event_commentses")
     * @ORM\JoinColumn(name="events_id", referencedColumnName="id", nullable=false)
     */
    private $events;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="event_commentses")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $ilook_user;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getMsg_text() {
		return $this->msg_text;
	}

	public function setMsg_text($msg_text) {
		$this->msg_text = $msg_text;
	}

	public function getEvents() {
		return $this->events;
	}

	public function setEvents($events) {
		$this->events = $events;
	}

	public function getIlook_user() {
		return $this->ilook_user;
	}

	public function setIlook_user($ilook_user) {
		$this->ilook_user = $ilook_user;
	}

}