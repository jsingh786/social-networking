<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class event_visitors
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=false)
     */
    private $visiting_probability;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="event_visitorses")
     * @ORM\JoinColumn(name="visitor_id", referencedColumnName="id", nullable=false)
     */
    private $ilook_user;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\events", inversedBy="event_visitorses")
     * @ORM\JoinColumn(name="events_id", referencedColumnName="id", nullable=false)
     */
    private $events;
    
    public function setId($id){
    	$this->id = $id;
    }
    public function getId(){
    	return $this->id;
    }
    public function setVisiting_probability($visiting_probability){
    	$this->visiting_probability=$visiting_probability;
    }
    public function getVisiting_probability(){
    	return $this->visiting_probability;
    }
    public function setIlook_user($ilook_user){
    	$this->ilook_user = $ilook_user;
    }
    public function getIlook_user(){
    	return $this->ilook_user;
    }
    public function setevents($events){
    	$this->events = $events;
    }
    public function getEvents(){
    	return $this->events;
    }
}