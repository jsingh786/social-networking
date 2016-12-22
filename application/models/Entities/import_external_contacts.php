<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class import_external_contacts
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $friend_email_id;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersImport_external_contacts")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $import_external_contactsUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getFriend_email_id() {
		return $this->friend_email_id;
	}

	public function setFriend_email_id($friend_email_id) {
		$this->friend_email_id = $friend_email_id;
	}

	public function getImport_external_contactsUser() {
		return $this->import_external_contactsUser;
	}

	public function setImport_external_contactsUser($import_external_contactsUser) {
		$this->import_external_contactsUser = $import_external_contactsUser;
	}

}