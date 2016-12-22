<?php
namespace Entities;
use Doctrine\ORM\Mapping AS ORM;

/**
 * @ORM\Entity
 */
class user_folder
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer", length=11)
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\OneToMany(targetEntity="Entities\message_folder", mappedBy="message_foldersUser_folder")
     */
    private $user_foldersMessage_folder;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\folder", inversedBy="folderUser_folder")
     * @ORM\JoinColumn(name="folder_id", referencedColumnName="id", nullable=false)
     */
    private $user_foldersFolder;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="createdbysUser_folder")
     * @ORM\JoinColumn(name="created_by", referencedColumnName="id", nullable=false)
     */
    private $user_foldersCreatedbyuser;

    /**
     * @ORM\ManyToOne(targetEntity="Entities\ilook_user", inversedBy="DeletedbyusersUser_folder")
     * @ORM\JoinColumn(name="deleted_by", referencedColumnName="id")
     */
    private $user_foldersDeletedbyUser;
	public function getId() {
		return $this->id;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function getUser_foldersMessage_folder() {
		return $this->user_foldersMessage_folder;
	}

	public function setUser_foldersMessage_folder($user_foldersMessage_folder) {
		$this->user_foldersMessage_folder = $user_foldersMessage_folder;
	}

	public function getUser_foldersFolder() {
		return $this->user_foldersFolder;
	}

	public function setUser_foldersFolder($user_foldersFolder) {
		$this->user_foldersFolder = $user_foldersFolder;
	}

	public function getUser_foldersCreatedbyuser() {
		return $this->user_foldersCreatedbyuser;
	}

	public function setUser_foldersCreatedbyuser($user_foldersCreatedbyuser) {
		$this->user_foldersCreatedbyuser = $user_foldersCreatedbyuser;
	}

	public function getUser_foldersDeletedbyUser() {
		return $this->user_foldersDeletedbyUser;
	}

	public function setUser_foldersDeletedbyUser($user_foldersDeletedbyUser) {
		$this->user_foldersDeletedbyUser = $user_foldersDeletedbyUser;
	}

}