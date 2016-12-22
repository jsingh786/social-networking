<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class events
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=2000, nullable=true)
     */
    private $details;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $type;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $privacy_level;

    /**
     * @ORM\Column(type="string", length=500, nullable=true)
     */
    private $address;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $country;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $start_datetime;

    /**
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $end_datetime;

    /**
     * @ORM\OneToMany(targetEntity="Entities\event_comments", mappedBy="events")
     */
    private $event_commentses;

    /**
     * @ORM\OneToMany(targetEntity="Entities\event_visitors", mappedBy="events")
     */
    private $event_visitorses;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="eventses")
     * @ORM\JoinColumn(name="organiser_id", referencedColumnName="id", nullable=false)
     */
    private $ilook_user;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getName() {
		return $this->name;
	}

	public function setName($name) {
		$this->name = $name;
	}

	public function getDetails() {
		return $this->details;
	}

	public function setDetails($details) {
		$this->details = $details;
	}

	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getPrivacy_level() {
		return $this->privacy_level;
	}

	public function setPrivacy_level($privacy_level) {
		$this->privacy_level = $privacy_level;
	}

	public function getAddress() {
		return $this->address;
	}

	public function setAddress($address) {
		$this->address = $address;
	}

	public function getCity() {
		return $this->city;
	}

	public function setCity($city) {
		$this->city = $city;
	}

	public function getCountry() {
		return $this->country;
	}

	public function setCountry($country) {
		$this->country = $country;
	}

	public function getStart_datetime() {
		return $this->start_datetime;
	}

	public function setStart_datetime($start_datetime) {
		$this->start_datetime = $start_datetime;
	}

	public function getEnd_datetime() {
		return $this->end_datetime;
	}

	public function setEnd_datetime($end_datetime) {
		$this->end_datetime = $end_datetime;
	}

	public function getEvent_commentses() {
		return $this->event_commentses;
	}

	public function setEvent_commentses($event_commentses) {
		$this->event_commentses = $event_commentses;
	}

	public function getEvent_visitorses() {
		return $this->event_visitorses;
	}

	public function setEvent_visitorses($event_visitorses) {
		$this->event_visitorses = $event_visitorses;
	}

	public function getIlook_user() {
		return $this->ilook_user;
	}

	public function setIlook_user($ilook_user) {
		$this->ilook_user = $ilook_user;
	}

}