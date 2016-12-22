<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class message_attachment
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
    private $name;


    /**
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $size;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $actual_name;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\message", inversedBy="messageMessage_attachment")
     * @ORM\JoinColumn(name="message_id", referencedColumnName="id", nullable=false)
     */
    private $message_attachmentsMessage;
    
    
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

	public function getSize() {
		return $this->size;
	}

	public function setSize($size) {
		$this->size = $size;
	}

	public function getActual_name() {
		return $this->actual_name;
	}

	public function setActual_name($actual_name) {
		$this->actual_name = $actual_name;
	}

	public function getMessage_attachmentsMessage() {
		return $this->message_attachmentsMessage;
	}

	public function setMessage_attachmentsMessage($message_attachmentsMessage) {
		$this->message_attachmentsMessage = $message_attachmentsMessage;
	}

}