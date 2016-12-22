<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;
use Gedmo\Mapping\Annotation as Gedmo;


/**
 * @ORM\Entity
 */
class enquiry
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="smallint", length=1, nullable=false)
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=20, nullable=true)
     */
    private $phone_number;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $subject;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $body;

    /**
     * @ORM\Column(type="string", length=255, nullable=false)
     */
    private $email_id;

    
	/**
	 * @var datetime $created_at
	 *
	 * @Gedmo\Timestampable(on="create")
	 * @ORM\Column(type="datetime")
	 */
    private $created_at;

    /**
     * @ORM\OneToMany(targetEntity="Entities\enquiry_attachment", mappedBy="enquiry", cascade={"remove"})
     */
    private $enquiryAttachment;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="enquiry")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     */
    private $ilookUser;
    
    
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getType() {
		return $this->type;
	}

	public function setType($type) {
		$this->type = $type;
	}

	public function getPhone_number() {
		return $this->phone_number;
	}

	public function setPhone_number($phone_number) {
		$this->phone_number = $phone_number;
	}

	public function getSubject() {
		return $this->subject;
	}

	public function setSubject($subject) {
		$this->subject = $subject;
	}

	public function getBody() {
		return $this->body;
	}

	public function setBody($body) {
		$this->body = $body;
	}

	public function getEmail_id() {
		return $this->email_id;
	}

	public function setEmail_id($email_id) {
		$this->email_id = $email_id;
	}

	public function getCreated_at() {
		return $this->created_at;
	}

	public function setCreated_at($created_at) {
		$this->created_at = $created_at;
	}

	public function getEnquiryAttachment() {
		return $this->enquiryAttachment;
	}

	public function setEnquiryAttachment($enquiryAttachment) {
		$this->enquiryAttachment = $enquiryAttachment;
	}

	public function getIlookUser() {
		return $this->ilookUser;
	}

	public function setIlookUser($ilookUser) {
		$this->ilookUser = $ilookUser;
	}

}