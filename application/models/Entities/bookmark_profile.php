<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class bookmark_profile
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="integer", length=1, nullable=true)
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="assignByUsersBookmark_profile")
     * @ORM\JoinColumn(name="ilook_user_id", referencedColumnName="id", nullable=false)
     */
    private $bookmark_profilesAssignByUser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="usersBookmark_profile")
     * @ORM\JoinColumn(name="ilook_second_user_id", referencedColumnName="id", nullable=false)
     */
    private $bookmark_profilesUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getStatus() {
		return $this->status;
	}

	public function setStatus($status) {
		$this->status = $status;
	}

	public function getBookmark_profilesAssignByUser() {
		return $this->bookmark_profilesAssignByUser;
	}

	public function setBookmark_profilesAssignByUser($bookmark_profilesAssignByUser) {
		$this->bookmark_profilesAssignByUser = $bookmark_profilesAssignByUser;
	}

	public function getBookmark_profilesUser() {
		return $this->bookmark_profilesUser;
	}

	public function setBookmark_profilesUser($bookmark_profilesUser) {
		$this->bookmark_profilesUser = $bookmark_profilesUser;
	}

}