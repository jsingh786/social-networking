<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class notes
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $user_note;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="profileUser_notes")
     * @ORM\JoinColumn(name="profile_user_id", referencedColumnName="id", nullable=false)
     */
    private $user_profileUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="currentUser_notes")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $notes_currentUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getUser_note() {
		return $this->user_note;
	}

	public function setUser_note($user_note) {
		$this->user_note = $user_note;
	}

	public function getUser_profileUser() {
		return $this->user_profileUser;
	}

	public function setUser_profileUser($user_profileUser) {
		$this->user_profileUser = $user_profileUser;
	}

	public function getNotes_currentUser() {
		return $this->notes_currentUser;
	}

	public function setNotes_currentUser($notes_currentUser) {
		$this->notes_currentUser = $notes_currentUser;
	}

}