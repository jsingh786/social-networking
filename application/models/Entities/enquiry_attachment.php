<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class enquiry_attachment
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
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    private $size;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $actual_name;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\enquiry", inversedBy="enquiryAttachment")
     * @ORM\JoinColumn(name="enquiry_id", referencedColumnName="id")
     */
    private $enquiry;
    
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

	public function getEnquiry() {
		return $this->enquiry;
	}

	public function setEnquiry($enquiry) {
		$this->enquiry = $enquiry;
	}

}